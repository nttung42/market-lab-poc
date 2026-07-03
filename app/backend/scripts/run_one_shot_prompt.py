import argparse
import asyncio
import json
import sys
from pathlib import Path
from typing import Any

BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.core.config import LLMConfigurationError, get_model_alias_config


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Run a one-shot prompt against the configured backend LLM alias."
    )
    parser.add_argument(
        "--alias",
        required=True,
        help="Backend LLM alias, for example 'respondent-generator' or 'study-simulator'.",
    )
    parser.add_argument(
        "--prompt",
        required=True,
        help="User prompt content to send.",
    )
    parser.add_argument(
        "--system",
        default="You are a concise helpful assistant.",
        help="Optional system prompt.",
    )
    parser.add_argument(
        "--temperature",
        type=float,
        default=0.2,
        help="Sampling temperature. Default: 0.2",
    )
    parser.add_argument(
        "--show-raw",
        action="store_true",
        help="Print the raw provider response as JSON after the text output.",
    )
    return parser.parse_args()


def _extract_text_content(raw_response: dict[str, Any]) -> str:
    content = raw_response["choices"][0]["message"]["content"]
    if isinstance(content, str):
        return content.strip()

    if isinstance(content, list):
        parts: list[str] = []
        for item in content:
            if isinstance(item, dict) and item.get("type") == "text":
                text = item.get("text")
                if text:
                    parts.append(str(text))
        return "\n".join(parts).strip()

    return str(content).strip()


def _normalize_usage(usage: dict[str, Any]) -> dict[str, Any]:
    prompt_tokens = usage.get("prompt_tokens")
    if prompt_tokens is None:
        prompt_tokens = usage.get("input_tokens")

    completion_tokens = usage.get("completion_tokens")
    if completion_tokens is None:
        completion_tokens = usage.get("output_tokens")

    total_tokens = usage.get("total_tokens")
    if total_tokens is None and isinstance(prompt_tokens, int) and isinstance(
        completion_tokens, int
    ):
        total_tokens = prompt_tokens + completion_tokens

    normalized = {
        "prompt_tokens": prompt_tokens,
        "completion_tokens": completion_tokens,
        "total_tokens": total_tokens,
    }
    return {key: value for key, value in normalized.items() if value is not None}


async def run_one_shot(
    *,
    alias: str,
    system_prompt: str,
    user_prompt: str,
    temperature: float,
    show_raw: bool,
) -> int:
    try:
        from litellm import acompletion
    except ImportError as exc:
        raise RuntimeError(
            "LiteLLM is required for backend AI execution but is not installed."
        ) from exc

    alias_config = get_model_alias_config(alias)
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]
    completion = await acompletion(
        model=alias_config.litellm_model,
        messages=messages,
        api_key=alias_config.api_key,
        api_base=alias_config.api_base,
        temperature=temperature,
    )
    raw_response = (
        completion.model_dump()
        if hasattr(completion, "model_dump")
        else dict(completion)
    )
    text_output = _extract_text_content(raw_response)

    print(f"alias={alias}")
    print(f"provider={alias_config.provider}")
    print(f"model={alias_config.litellm_model}")
    print("")
    print(text_output)

    usage = raw_response.get("usage")
    if usage:
        normalized_usage = _normalize_usage(usage)
        print("")
        if normalized_usage:
            print(f"token_usage={json.dumps(normalized_usage, ensure_ascii=False)}")
        print(f"usage={json.dumps(usage, ensure_ascii=False)}")

    if show_raw:
        print("")
        print(json.dumps(raw_response, indent=2, ensure_ascii=False))

    return 0


def main() -> int:
    args = parse_args()
    try:
        return asyncio.run(
            run_one_shot(
                alias=args.alias,
                system_prompt=args.system,
                user_prompt=args.prompt,
                temperature=args.temperature,
                show_raw=args.show_raw,
            )
        )
    except LLMConfigurationError as exc:
        print(f"Configuration error: {exc}", file=sys.stderr)
        return 2
    except Exception as exc:
        print(f"LLM call failed: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
