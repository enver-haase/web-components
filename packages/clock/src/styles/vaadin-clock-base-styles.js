/**
 * @license
 * Copyright (c) 2018 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

/**
 * Base styles for vaadin-clock - Amiga Workbench 1.2 aesthetic
 */
export const clockStyles = css`
  :host {
    /* Amiga Workbench 1.2 color palette */
    --vaadin-clock-size: 120px;
    --vaadin-clock-background: #0055aa;
    --vaadin-clock-face-color: #aaaaaa;
    --vaadin-clock-inner-face-color: #ffffff;
    --vaadin-clock-border-color: #ffffff;
    --vaadin-clock-border-shadow: #000000;
    --vaadin-clock-hour-hand-color: #000000;
    --vaadin-clock-minute-hand-color: #000000;
    --vaadin-clock-second-hand-color: #ff8800;
    --vaadin-clock-tick-color: #000000;
    --vaadin-clock-center-color: #ff8800;

    display: inline-block;
    width: var(--vaadin-clock-size);
    height: var(--vaadin-clock-size);
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([disabled]) {
    opacity: 0.5;
    pointer-events: none;
  }

  .clock-container {
    width: 100%;
    height: 100%;
    background: var(--vaadin-clock-background);
    /* Amiga-style beveled border */
    border: 2px solid var(--vaadin-clock-border-color);
    border-right-color: var(--vaadin-clock-border-shadow);
    border-bottom-color: var(--vaadin-clock-border-shadow);
    box-sizing: border-box;
    /* Pixelated rendering for retro feel */
    image-rendering: pixelated;
    image-rendering: crisp-edges;
  }

  .clock-svg {
    width: 100%;
    height: 100%;
    display: block;
  }

  .clock-face {
    fill: var(--vaadin-clock-face-color);
    stroke: var(--vaadin-clock-border-shadow);
    stroke-width: 1;
  }

  .clock-inner-face {
    fill: var(--vaadin-clock-inner-face-color);
    stroke: var(--vaadin-clock-border-shadow);
    stroke-width: 0.5;
  }

  .tick {
    stroke: var(--vaadin-clock-tick-color);
    stroke-width: 1.5;
    stroke-linecap: square;
  }

  .tick-main {
    stroke-width: 2.5;
  }

  .hour-hand {
    stroke: var(--vaadin-clock-hour-hand-color);
    stroke-width: 4;
    stroke-linecap: square;
  }

  .minute-hand {
    stroke: var(--vaadin-clock-minute-hand-color);
    stroke-width: 3;
    stroke-linecap: square;
  }

  .second-hand {
    stroke: var(--vaadin-clock-second-hand-color);
    stroke-width: 1.5;
    stroke-linecap: square;
  }

  .center-dot {
    fill: var(--vaadin-clock-center-color);
    stroke: var(--vaadin-clock-border-shadow);
    stroke-width: 0.5;
  }

  /* Ensure crisp edges for the retro look */
  line,
  rect {
    shape-rendering: crispEdges;
  }
`;
