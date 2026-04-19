const { createCliRenderer, Box, Text } = require("@opentui/core");

async function main() {
  const renderer = await createCliRenderer();
  const screen = renderer.screen;

  screen.add(
    Box({
      width: "100%",
      height: "100%",
      flexDirection: "column",
      padding: 1,
    },
      Box(
        { width: "100%", flexDirection: "row", gap: 2 },
        Box({ 
          width: "30%", 
          backgroundColor: "#1e1e2e", 
          padding: 1,
          flexDirection: "column" 
        },
          Text({ content: "📊 Dashboard", fg: "#89b4fa" }),
          Text({ content: "", fg: "#a6adc8" }),
          Text({ content: "Goals: 3", fg: "#a6adc8" }),
          Text({ content: "Notes: 5", fg: "#a6adc8" }),
        ),
        Box({ 
          flexGrow: 1, 
          backgroundColor: "#1e1e2e", 
          padding: 1,
          flexDirection: "column" 
        },
          Text({ content: "🎯 Today's Goals", fg: "#89b4fa" }),
          Text({ content: "", fg: "#a6adc8" }),
          Text({ content: "[] Exercise", fg: "#a6adc8" }),
          Text({ content: "[] Read 30 min", fg: "#a6adc8" }),
        ),
      ),
      Box({ width: "100%", flexDirection: "row", gap: 2, marginTop: 1 },
        Text({ content: "Press 'q' to quit", fg: "#6c7086" })
      )
    )
  );

  screen.key("q", () => {
    process.exit(0);
  });

  console.log("Resync TUI - Press q to quit");
}

main().catch(console.error);