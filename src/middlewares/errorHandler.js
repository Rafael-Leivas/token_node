export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      statusCode: 500,
      message: "Algo deu errado!",
      error: err.message
    });
  };