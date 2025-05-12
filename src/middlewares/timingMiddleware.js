export const timingMiddleware = async (req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      res.setHeader("X-Process-Time", `${duration}ms`);
    });
    next();
  };