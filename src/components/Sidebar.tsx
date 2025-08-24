import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  TrendingUp,
  CheckSquare,
  FileText,
  MapPin,
  List,
  Play,
  Settings,
  User,
  Menu,
  X,
} from "lucide-react";

interface SidebarProps {
  activePanel: string;
  setActivePanel: (panel: any) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  focusMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  activePanel,
  setActivePanel,
  isOpen,
  setIsOpen,
  focusMode,
}) => {
  if (focusMode) return null;

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "streak", label: "Streak Tracker", icon: TrendingUp },
    { id: "todo", label: "Todo List", icon: CheckSquare },
    { id: "notes", label: "Notes", icon: FileText },
    { id: "roadmap", label: "Roadmap", icon: MapPin },
    { id: "checkin", label: "Check-ins", icon: List },
    { id: "youtube", label: "YouTube", icon: Play },
    { id: "profile", label: "Profile", icon: User },
    { id: "focus", label: "Focus Mode", icon: Play },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Detect mobile and hover-capability
  const [isMobile, setIsMobile] = React.useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  const [canHover, setCanHover] = React.useState<boolean>(() =>
    typeof window !== "undefined"
      ? !!(
          window.matchMedia &&
          window.matchMedia("(hover: hover) and (pointer: fine)").matches
        )
      : false
  );

  // Track whether the sidebar was opened by hover (auto-open)
  const [openedByHover, setOpenedByHover] = React.useState(false);

  // Track whether pointer is over the left-edge hover zone and/or over the sidebar itself
  const [hoveredHoverZone, setHoveredHoverZone] = React.useState(false);
  const [hoveredSidebar, setHoveredSidebar] = React.useState(false);

  // Keep a ref for the close timeout so we can cancel it if needed
  const closeTimeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    // Setup matchMedia for hover detection and listen for changes
    let mq: MediaQueryList | null = null;
    const setupMatchMedia = () => {
      if (window.matchMedia) {
        mq = window.matchMedia("(hover: hover) and (pointer: fine)");
        const update = (ev?: MediaQueryListEvent) =>
          setCanHover(!!(ev ? ev.matches : mq && mq.matches));
        if (mq.addEventListener) mq.addEventListener("change", update);
        else if (mq.addListener) mq.addListener(update);
        update();
      } else {
        setCanHover(false);
      }
    };

    setupMatchMedia();
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mq) {
        try {
          if ((mq as any).removeEventListener)
            (mq as any).removeEventListener("change", () => {});
          else if ((mq as any).removeListener)
            (mq as any).removeListener(() => {});
        } catch (e) {
          // ignore cleanup errors on older browsers
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When either the hover zone or the sidebar is hovered, open the sidebar (auto-open).
  // When neither is hovered, and the sidebar was opened by hover, auto-close it after a short delay.
  React.useEffect(() => {
    // Clear any pending timeout
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    if ((hoveredHoverZone || hoveredSidebar) && !isMobile && canHover) {
      // Pointer moved into the hover area or sidebar: open (if not already)
      if (!isOpen) {
        // mark that this open came from hover so we can auto-close later
        setOpenedByHover(true);
        setIsOpen(true);
      } else {
        // if already open, keep openedByHover as-is; don't override manual open
      }
    } else {
      // Pointer left both areas
      if (openedByHover && !isMobile && canHover) {
        // close after a small delay to allow pointer to move between hover zone and sidebar
        closeTimeoutRef.current = window.setTimeout(() => {
          setIsOpen(false);
          setOpenedByHover(false);
          closeTimeoutRef.current = null;
        }, 120); // 80-200ms feels natural; adjust if needed
      } else {
        // either not opened by hover (user opened manually), or not hover-capable, do nothing
      }
    }

    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    };
    // only react to these specific states
  }, [
    hoveredHoverZone,
    hoveredSidebar,
    isMobile,
    canHover,
    openedByHover,
    isOpen,
    setIsOpen,
  ]);

  // When user toggles manually (hamburger), treat it as manual open/close and clear openedByHover
  const handleToggleButton = () => {
    // Clear hover flags so auto-close won't run
    setHoveredHoverZone(false);
    setHoveredSidebar(false);
    setOpenedByHover(false);
    setIsOpen((prev) => !prev);
  };

  // When user clicks a nav item, we consider that a manual interaction; clear openedByHover so it doesn't auto-close afterwards.
  const handleNavClick = (id: string) => {
    setActivePanel(id);
    if (isMobile) setIsOpen(false);
    setOpenedByHover(false);
  };

  // If this component mounts on a hover-capable desktop, ensure sidebar starts closed so hover works.
  // (If your parent sets isOpen=true by default on desktop, hover will appear to do nothing — we force closed here to enable the hover UX.)
  React.useEffect(() => {
    if (!isMobile && canHover) {
      // Do not call this repeatedly; only adjust on mount
      setIsOpen(false);
      setOpenedByHover(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Layout z-index: hover zone must be above content but below the open sidebar.
  // We'll render hover zone only on non-mobile hover-capable devices.
  const HOVER_ZONE_PX = 22;

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <button
          onClick={handleToggleButton}
          className="fixed top-4 left-4 z-60 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      )}

      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => {
            setIsOpen(false);
            setOpenedByHover(false);
          }}
        />
      )}

      {/* Hover zone (invisible handle) - only on desktop hover-capable devices */}
      {!isMobile && canHover && (
        <div
          // a thin strip on the left edge
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            height: "100vh",
            width: `${HOVER_ZONE_PX}px`,
            zIndex: 48, // above main content (so pointer enters it), below the sidebar (sidebar uses 60)
            pointerEvents: "auto",
            background: "transparent",
          }}
          onMouseEnter={() => {
            setHoveredHoverZone(true);
          }}
          onMouseLeave={() => {
            setHoveredHoverZone(false);
          }}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        // use inline transform for predictable behavior across environments
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          width: 256, // w-64
          background: undefined, // Tailwind classes below handle bg
          zIndex: 60,
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 180ms ease-in-out",
        }}
        className="bg-white dark:bg-gray-800 shadow-lg"
        onMouseEnter={() => {
          setHoveredSidebar(true);
        }}
        onMouseLeave={() => {
          setHoveredSidebar(false);
        }}
      >
        <div className="p-6">
          <button
            onClick={() => {
              // Brand click: navigate/refresh behavior kept from previous version
              setActivePanel("dashboard");
              if (isMobile) setIsOpen(false);
              setOpenedByHover(false);

              if (
                window.location.pathname === "/" ||
                window.location.pathname === ""
              ) {
                window.location.reload();
              } else {
                window.location.href = "/";
              }
            }}
            className="flex items-center space-x-2 mb-8 w-full text-left"
            aria-label="Go to StudyFlow dashboard"
            type="button"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              StudyFlow
            </h1>
          </button>

          {/* Manual toggle for desktop if you still want a button to pin open */}
          <div className="mb-4">
            <button
              onClick={handleToggleButton}
              className="text-sm px-2 py-1 rounded bg-gray-100 dark:bg-gray-700"
            >
              {isOpen ? "Pin / Close" : "Open"}
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={`/${item.id === "dashboard" ? "" : item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${
                      activePanel === item.id
                        ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
