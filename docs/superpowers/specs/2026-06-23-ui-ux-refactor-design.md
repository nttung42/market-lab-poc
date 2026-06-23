# Design Specification: UI/UX Refactor & Workspace Modals

## Overview
This specification details the UI/UX refactoring of the Market Lab PoC. It upgrades the navigation structure, introduces centered overlay modals for project creation/editing, and implements a unified Modern Minimal Glassmorphism design system.

## 1. Visual Theme: Modern Minimal Glassmorphism
The styling will be refined in [index.css](file:///d:/FPTU/7/EXE101/market-lab-poc/app/frontend/src/index.css) to support:
*   **Colors**: Keep existing tailwind `@theme` tokens, but use them with transparency values where appropriate (e.g. `bg-white/70`, `backdrop-blur-md`, `border-ml-border/60`).
*   **Glassmorphic Cards**: Cards and panels will use light semi-transparent backgrounds, subtle white borders, and soft shadows to simulate depth.
*   **Active Tab States**: Interactive tabs will use bottom accent lines and background highlight tints (`bg-ml-blue-soft/50`) to provide excellent visual feedback.

## 2. Navigation Layout
The navigation will be divided into two layers in [App.tsx](file:///d:/FPTU/7/EXE101/market-lab-poc/app/frontend/src/App.tsx):
1.  **Global Header (Primary Navigation)**:
    *   **Logo/Brand**: Tapping returns to Project Directory.
    *   **Workspace Selector Dropdown**: Center dropdown displaying active project or "Select Workspace" with a quick-switch list and a "+ Initialize Workspace" option.
    *   **Action Area**: Quick link to Project Directory and "+ New Project" button.
2.  **Workspace Sub-Tab Navigation (Secondary Navigation)**:
    *   Displayed horizontally below the global header only when a project is active.
    *   Includes: `OVERVIEW`, `PERSONAS`, `RESPONDENTS`, `STUDY BUILDER`, `DASHBOARD`, `REPORTS`.

## 3. Project CRUD Modals
*   **Overlay Modal**: Convert the Create Project and Edit Project pages into modals triggered statefully (`showCreateProjectModal: boolean`, `showEditProjectModal: boolean`).
*   **Backdrop**: `fixed inset-0 bg-ml-ink/40 backdrop-blur-md z-50 flex items-center justify-center`
*   **Animation**: Smooth transition using opacity and scale (`scale-95` to `scale-100`).

## 4. Verification Plan
*   **Manual Verification**: Use local browser testing to check active states, modal popups, click behaviors, and responsivity.
*   **Code Review**: Check for console errors or broken navigation loops when switching projects.
