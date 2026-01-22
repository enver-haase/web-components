# @vaadin/clock

A Web Component displaying an analog clock face with an Amiga Workbench 1.2 aesthetic.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/clock)

## Installation

Install the component:

```sh
npm i @vaadin/clock
```

Once installed, import the component in your application:

```js
import '@vaadin/clock';
```

## Usage

```html
<vaadin-clock></vaadin-clock>
```

When no value is set, the clock displays the current time and animates in real-time.

To display a specific time:

```js
const clock = document.querySelector('vaadin-clock');
clock.value = '14:30:00';
```

## Styling

The clock uses CSS custom properties for styling:

| Custom Property | Description | Default |
|-----------------|-------------|---------|
| `--vaadin-clock-size` | Size of the clock | `120px` |
| `--vaadin-clock-background` | Background color | `#0055AA` |
| `--vaadin-clock-face-color` | Clock face color | `#AAAAAA` |
| `--vaadin-clock-hour-hand-color` | Hour hand color | `#000000` |
| `--vaadin-clock-minute-hand-color` | Minute hand color | `#000000` |
| `--vaadin-clock-second-hand-color` | Second hand color | `#FF8800` |

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process and how to propose bug fixes and improvements.

## License

Apache License 2.0
