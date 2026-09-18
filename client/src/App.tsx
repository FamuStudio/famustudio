import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import FamuShell from "./components/FamuShell";
import { SelectionProvider } from "./contexts/SelectionContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import ProjectDetail from "./pages/ProjectDetail";
import Selection from "./pages/Selection";
import ServiceDetail from "./pages/ServiceDetail";
import Services from "./pages/Services";

function Router() {
  return <FamuShell><Switch>
    <Route path="/" component={Home} />
    <Route path="/servicos" component={Services} />
    <Route path="/servicos/:slug" component={ServiceDetail} />
    <Route path="/portfolio" component={Portfolio} />
    <Route path="/portfolio/:slug" component={ProjectDetail} />
    <Route path="/sobre" component={About} />
    <Route path="/contacto" component={Contact} />
    <Route path="/selecao" component={Selection} />
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch></FamuShell>;
}

function App() {
  return <ErrorBoundary>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <Toaster />
        <SelectionProvider><Router /></SelectionProvider>
      </TooltipProvider>
    </ThemeProvider>
  </ErrorBoundary>;
}

export default App;
