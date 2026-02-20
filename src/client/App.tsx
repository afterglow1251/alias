import { Router, Route } from "@solidjs/router"
import { HomePage } from "./routes/HomePage"
import { LobbyPage } from "./routes/LobbyPage"
import { GamePage } from "./routes/GamePage"

export default function App() {
  return (
    <Router>
      <Route path="/" component={HomePage} />
      <Route path="/lobby" component={LobbyPage} />
      <Route path="/game" component={GamePage} />
    </Router>
  )
}
