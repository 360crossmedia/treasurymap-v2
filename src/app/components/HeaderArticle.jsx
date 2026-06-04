"use client";

const HeaderArticle = ({ title }) => {
  const isMedia = !!title;
  return (
    <div
      style={{
        textAlign: "center",
        padding: "46px 20px 26px",
        fontFamily: "'Chivo', system-ui, -apple-system, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: 30,
          fontWeight: 800,
          color: "#0e2c5c",
          margin: "0 0 8px",
          letterSpacing: "-.01em",
        }}
      >
        {isMedia ? `Media Zone — ${title}` : "Complete the company's information"}
      </h1>
      <p style={{ fontSize: 14.5, color: "#5a6a85", margin: 0 }}>
        {isMedia
          ? "Create and manage this company's articles and videos."
          : "Fill in what you have — you can always come back to complete the rest."}
      </p>
    </div>
  );
};

export default HeaderArticle;
