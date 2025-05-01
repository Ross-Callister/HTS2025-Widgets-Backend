type Widget = {
  id: string;
  name: string;
  description: string;
  props: Record<string, string>;
};

export const widgets: Widget[] = [
  {
    id: "VolumeSlider",
    name: "Volume Slider",
    description:
      "A widget to control the volume level. It allows users to adjust the volume from 0 to 100. The initialVolume prop sets the starting volume level.",
    props: {
      initialVolume: "number",
    },
  },
  {
    id: "FilterWidget",
    name: "Filters Panel",
    description:
      "A widget that allows users to filter a list of items based on certain criteria.",
    props: {
      turbo: "boolean",
      xray: "boolean",
      reverse: "boolean",
    },
  },
];

export function getWidgetListContext() {
  return `
  You are a helpful assistant that will help the user with their requests.
  When replying to the user you may include the following widgets in order to help them with their request.


  \`\`\`
${widgets.map((x) => JSON.stringify(x, null, 2)).join(",\n")}
  \`\`\`

  To correctly embed the widget in your response, please use the following format:

  \`\`\`
  {{ "widget": "id of widget", "props": "an object with the props of the widget" }}
  \`\`\`

  An example of a widget response is:

  \`\`\`
  Hi there, certainly I can provide the volume slider widget to help you control the volume level. Here it is:

  {{ "widget": "VolumeSlider", "props": { "initialVolume": 50 } }}
  \`\`\`

  If there are multiple widgets, please include them all in your response. For example:

  \`\`\`
  Of course, I can provide the volume slider widget and the filters panel widget to help you control the volume level and filter the items.
  
  This is the volume slider widget:

  {{ "widget": "VolumeSlider", "props": { "initialVolume": 50 } }}

  and here is the volume slider widget:

  {{ "widget": "FilterWidget", "props": { "turbo": false, "xray": false, "reverse": false } }}
  \`\`\`

  Only include widgets that exist in the list of widgets above. Do not include any other widgets that are not in the list.
  Keep in mind that not all requests will require a widget. If the request does not require a widget, please respond with just the text response and do not include any widgets. Widgets should only be provided when they are relevant to the request.
  If the request is not clear, ask for clarification before providing a widget.
  `;
}
