  import React from "react";

  const SearchBar = () => {
    const colors = {
      accent: "#D4AF37",
      accentDark: "#B88917"
    };

    // Responsive styles based on screen size
    const getStyles = () => {
      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
      const isDesktop = window.innerWidth > 1024;

      return {
        container: {
          marginTop: isMobile ? "20px" : isTablet ? "28px" : "32px",
          maxWidth: isMobile ? "90%" : isTablet ? "85%" : "600px",
          marginLeft: "auto",
          marginRight: "auto",
          padding: isMobile ? "0 12px" : "0",
          transition: "all 0.3s ease"
        },
        wrapper: {
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          borderRadius: isMobile ? "30px" : "40px",
          padding: isMobile ? "3px 6px" : "4px 8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e0e0e0",
          transition: "all 0.3s ease",
          cursor: "pointer"
        },
        icon: {
          fontSize: isMobile ? "16px" : isTablet ? "18px" : "20px",
          marginLeft: isMobile ? "6px" : "8px",
          marginRight: isMobile ? "2px" : "4px",
          color: "#666",
          transition: "all 0.2s ease"
        },
        input: {
          flex: 1,
          border: "none",
          outline: "none",
          fontSize: isMobile ? "12px" : isTablet ? "14px" : "16px",
          padding: isMobile ? "8px 4px" : isTablet ? "10px 6px" : "12px 8px",
          background: "transparent",
          fontFamily: "inherit",
          color: "#333",
          width: "100%"
        },
        button: {
          backgroundColor: colors.accent,
          color: "white",
          border: "none",
          borderRadius: isMobile ? "25px" : "40px",
          padding: isMobile ? "6px 16px" : isTablet ? "7px 20px" : "8px 24px",
          fontSize: isMobile ? "11px" : isTablet ? "12px" : "14px",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "all 0.3s ease",
          fontFamily: "inherit",
          whiteSpace: "nowrap",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }
      };
    };

    const styles = getStyles();

    // Handle window resize
    const [windowSize, setWindowSize] = React.useState({
      width: window.innerWidth,
      height: window.innerHeight
    });

    React.useEffect(() => {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Recalculate styles on resize
    const currentStyles = React.useMemo(() => {
      const isMobile = windowSize.width <= 768;
      const isTablet = windowSize.width > 768 && windowSize.width <= 1024;
      
      return {
        container: {
          marginTop: isMobile ? "20px" : isTablet ? "28px" : "32px",
          maxWidth: isMobile ? "90%" : isTablet ? "85%" : "600px",
          marginLeft: "auto",
          marginRight: "auto",
          padding: isMobile ? "0 12px" : "0",
          transition: "all 0.3s ease"
        },
        wrapper: {
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          borderRadius: isMobile ? "30px" : "40px",
          padding: isMobile ? "3px 6px" : "4px 8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e0e0e0",
          transition: "all 0.3s ease",
          cursor: "pointer",
          ...(windowSize.width <= 480 && {
            padding: "2px 4px"
          })
        },
        icon: {
          fontSize: isMobile ? (windowSize.width <= 480 ? "14px" : "16px") : isTablet ? "18px" : "20px",
          marginLeft: isMobile ? (windowSize.width <= 480 ? "4px" : "6px") : "8px",
          marginRight: isMobile ? (windowSize.width <= 480 ? "2px" : "2px") : "4px",
          color: "#666",
          transition: "all 0.2s ease"
        },
        input: {
          flex: 1,
          border: "none",
          outline: "none",
          fontSize: isMobile ? (windowSize.width <= 480 ? "11px" : "12px") : isTablet ? "14px" : "16px",
          padding: isMobile ? (windowSize.width <= 480 ? "6px 3px" : "8px 4px") : isTablet ? "10px 6px" : "12px 8px",
          background: "transparent",
          fontFamily: "inherit",
          color: "#333",
          width: "100%",
          "&::placeholder": {
            color: "#999",
            fontSize: isMobile ? (windowSize.width <= 480 ? "10px" : "11px") : isTablet ? "13px" : "14px"
          }
        },
        button: {
          backgroundColor: colors.accent,
          color: "white",
          border: "none",
          borderRadius: isMobile ? (windowSize.width <= 480 ? "20px" : "25px") : "40px",
          padding: isMobile ? (windowSize.width <= 480 ? "5px 12px" : "6px 16px") : isTablet ? "7px 20px" : "8px 24px",
          fontSize: isMobile ? (windowSize.width <= 480 ? "10px" : "11px") : isTablet ? "12px" : "14px",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "all 0.3s ease",
          fontFamily: "inherit",
          whiteSpace: "nowrap",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }
      };
    }, [windowSize.width]);

    // Handle hover effects
    const [isHovered, setIsHovered] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <div style={currentStyles.container}>
        <div 
          style={{
            ...currentStyles.wrapper,
            boxShadow: isFocused 
              ? "0 4px 12px rgba(0, 0, 0, 0.15)" 
              : "0 2px 8px rgba(0, 0, 0, 0.1)",
            borderColor: isFocused ? colors.accent : "#e0e0e0"
          }}
        >
          <span style={currentStyles.icon}>🔍</span>
          <input
            type="text"
            aria-label="Search services"
            style={currentStyles.input}
            placeholder="Search: Electrician, Event Management, Security Guards, Office Equipment..."
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <button 
            style={{
              ...currentStyles.button,
              backgroundColor: isHovered ? colors.accentDark : colors.accent,
              transform: isHovered ? "scale(1.02)" : "scale(1)",
              boxShadow: isHovered 
                ? "0 4px 8px rgba(0, 0, 0, 0.2)" 
                : "0 1px 3px rgba(0, 0, 0, 0.1)"
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseDown={(e) => {
              e.target.style.transform = "scale(0.98)";
            }}
            onMouseUp={(e) => {
              e.target.style.transform = "scale(1)";
            }}
          >
            Search
          </button>
        </div>
      </div>
    );
  };

  export default SearchBar;