import { Router, Route } from "@solidjs/router"
import { HomePage } from "./routes/HomePage"
import { LobbyPage } from "./routes/LobbyPage"
import { GamePage } from "./routes/GamePage"
import { FloatingPenguins } from "./components/ui/FloatingPenguins"

export default function App() {
  return (
    <div class="bg-gradient min-h-dvh relative">
      <FloatingPenguins />
      <div class="relative z-10">
        <Router>
          <Route path="/" component={HomePage} />
          <Route path="/lobby" component={LobbyPage} />
          <Route path="/game" component={GamePage} />
        </Router>
      </div>
    </div>
  )
}
