import time
from playwright.sync_api import sync_playwright

def run():
    print("Launching browser...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        
        # Listen to console and errors
        page.on("console", lambda msg: print(f"[CONSOLE] {msg.type}: {msg.text}"))
        page.on("pageerror", lambda exc: print(f"[PAGE ERROR] {exc}"))
        page.on("requestfailed", lambda req: print(f"[REQ FAILED] {req.method} {req.url} - {req.failure.error_text}"))
        
        print("Navigating to app...")
        page.goto("http://localhost:5173/#/projects/english-learning-app-poc/personas")
        page.wait_for_load_state("networkidle")
        time.sleep(2)
        
        print("Clicking Create Persona button...")
        # Let's find and click the CREATE PERSONA button
        btn = page.locator("button:has-text('CREATE PERSONA')")
        btn.click()
        time.sleep(1)
        
        print("Filling out form...")
        page.locator("input[placeholder='Minh Thu']").fill("Test Persona Name")
        page.locator("input[placeholder='Price-sensitive student']").fill("Test Segment Label")
        page.locator("input[placeholder='I want to learn speaking but pricing is a barrier...']").fill("Test Quote")
        
        # Let's see if there are empty textareas that fail validation.
        # Let's empty out one of the textareas.
        # Demographics, Goals, Pain Points, Objections, Decision Rules, Assumptions, Motivations, Buying, Channels.
        # The form has defaults:
        # formDemographics has default value from handleStartCreate
        # Let's print out what is currently in form textareas:
        print("Default demographics value:", page.locator("textarea[placeholder*='Age:']").input_value())
        
        # Now let's try to clear one field to see if it triggers an error
        # e.g., Motivations or Buying behavior or Channel preferences.
        # Let's clear motivations:
        # The motivations textarea has no placeholder, but let's locate it.
        # Let's look at the label text: Motivations (One per line)
        # The textarea is the sibling of this label.
        motivations_textarea = page.locator("label:has-text('Motivations')").locator("xpath=../textarea")
        print("Default motivations value:", motivations_textarea.input_value())
        
        # Let's clear motivations and submit
        print("Clearing motivations...")
        motivations_textarea.fill("")
        
        print("Clicking Save...")
        save_btn = page.locator("button:has-text('SAVE PERSONA PROFILE')")
        save_btn.click()
        
        time.sleep(2)
        browser.close()

if __name__ == "__main__":
    run()
