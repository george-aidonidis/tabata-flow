# React Tabata Timer

**Version:** 3.1 (Final)
**Date:** October 27, 2023
**Author:** AI Assistant
**Status:** Approved, Ready for Implementation

## 1. Overview

This document outlines the final design and technical standards for a client-side Tabata and interval training web application built using **React with TypeScript v5.8**. It emphasizes code quality, maintainability, and robust testing. The core functionality provides a customizable timer with a distinctive circular progress ring as its central visual element. The project will adhere to strict standards for linting, formatting, component size, and will be validated by both unit and end-to-end tests.

## 2. Core Concepts & Workout Flow

The workout is defined by user-configurable parameters and a fixed preparation phase.

*   **Phases:** Prepare (5s fixed), Work, Short Break, Long Break, Finished.
*   **Parameters:** Work, Short Break, Sets, Long Break, Cycles.
*   **Flow Logic:** The workout proceeds from Prepare -> Work. Each Work interval is followed by a Short Break, *except* for the last set of a cycle, which is followed by a Long Break (or transitions to Finished if it's the final cycle).

## 3. Functional Requirements (FR)

| ID     | Requirement           | Description & Details                                                                                                                                                                                                                                                                                        |
| :----- | :-------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FR-1** | **Timer Configuration** | User inputs will be validated according to these constraints: <br> • **Work:** 1-90s <br> • **Short Break:** 0-30s <br> • **Sets:** 1-16 <br> • **Long Break:** 0-90s <br> • **Cycles:** 1-30.                                                                                                            |
| **FR-2** | **Timer Operation**     | A **Web Worker** will manage the timer logic to ensure accuracy, unaffected by main-thread blocking or background tab throttling.                                                                                                                                                                             |
| **FR-3** | **Visual Feedback**     | The circular progress ring will **fill up** as the timer counts down.                                                                                                                                                                                                                                       |
| **FR-4** | **State Indication**    | UI will clearly display phase, time remaining (MM:SS), current set, and current cycle.                                                                                                                                                                                                                      |
| **FR-5** | **User Controls**       | Controls for Start, Pause, Resume. **Reset** stops the timer and returns the user to the Settings screen.                                                                                                                                                                                                  |
| **FR-6** | **Audio Cues**          | Tones generated via Web Audio API for 3-second countdowns and new interval starts.                                                                                                                                                                                                                         |
| **FR-7** | **Settings Persistence**| `localStorage` will be used to persist the user's last-used configuration.                                                                                                                                                                                                                                 |
| **FR-8** | **Phase Color Coding**  | The **stroke of the circular progress ring** must change color to reflect the current phase. The page background remains static. The color palette is chosen for clarity and accessibility: <br> • **Prepare:** **Orange (`#F5A623`)** - Signals readiness, attention. <br> • **Work:** **Red (`#E53E3E`)** - Signals intensity and action. <br> • **Break (Short & Long):** **Teal (`#319795`)** - A single, calming color for all rest periods. <br> • **Finished:** **Gold (`#D69E2E`)** - A celebratory color for workout completion. |
| **FR-9** | **Workout Completion**| A "Workout Complete!" message will be displayed upon finishing the last cycle. The ring will be Gold. |

## 4. Non-Functional Requirements (NFR)

| ID      | Requirement       | How It Will Be Met                                                                  |
| :------ | :---------------- | :---------------------------------------------------------------------------------- |
| **NFR-1** | **Performance**     | Web Worker for timer accuracy. Small, focused components for efficient rendering.    |
| **NFR-2** | **Responsiveness**  | Mobile-first CSS design.                                                            |
| **NFR-3** | **Accessibility**   | Semantic HTML, ARIA attributes, keyboard navigation, and `prefers-reduced-motion` considerations. |
| **NFR-4** | **Maintainability** | Enforced by TypeScript, ESLint, Prettier, small component size, and a comprehensive test suite. |

## 5. Architecture & Technical Design

#### 5.1. Tech Stack & Tooling

*   **Core:** **React 19.1.0** with **TypeScript v5.8**.
*   **State Management:** React Hooks (`useReducer`, `useContext`) with strong TypeScript typing for state and actions.
*   **Styling:** CSS Modules or Styled-Components.
*   **Unit & Integration Testing:** **Vitest**.
*   **End-to-End (E2E) Testing:** **Playwright**.
*   **Linting:** **ESLint**.
*   **Formatting:** **Prettier**.

#### 5.2. Code Quality & Formatting Standards

*   **Component Size:** No component file (`.tsx`) should exceed **250 lines of code**. Logic-heavy parts should be extracted into custom hooks (`.ts`).
*   **Prettier Configuration:** The project's `.prettierrc` file will contain:
    ```json
    {
      "singleQuote": true,
      "semi": false
    }
    ```

## 6. Testing Strategy

A multi-layered testing strategy will be implemented to ensure application quality.

#### 6.1. Unit & Integration Tests (Vitest)

*   **Scope:** Individual functions, hooks, and components will be tested in isolation.
*   **Targets:**
    *   **Utils:** Test utility functions like `timeFormatter`.
    *   **Hooks:** Extensively test the `useTimer` reducer logic for all state transitions.
    *   **Components:** Test that components render correctly given different props.

#### 6.2. End-to-End Tests (Playwright)

*   **Scope:** The entire application running in a browser, simulating real user interactions.
*   **Key Test Scenario ("The Golden Path"):**
    1.  **Launch** the application and assert the Settings screen is visible.
    2.  **Configure** new values for all settings.
    3.  **Click** "Start Workout" and assert the Timer screen appears in the "Prepare" phase.
    4.  **Wait** for the "Work" phase and assert the ring color changes.
    5.  **Click** "Pause" and assert the timer stops.
    6.  **Click** "Resume" and assert the timer continues.
    7.  **Click** "Reset" and assert the application returns to the Settings screen.

## 7. Edge Cases & System Logic

*   **Zero-Duration Breaks:** The timer will immediately transition to the next phase without pausing.
*   **Tab Inactivity:** The Web Worker ensures the timer remains accurate in the background.
*   **Page Refresh:** The workout session is reset, but settings from `localStorage` are reloaded on the Settings screen.
*   **First User Interaction:** `AudioContext` is initialized on the first "Start Workout" click to comply with browser policies.
*   **Invalid Input:** Standard HTML5 `min` and `max` attributes will be used for input validation.