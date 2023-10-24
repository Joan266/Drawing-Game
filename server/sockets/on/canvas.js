export default async (room, socket, io) => {
  const mouseDown = (offsetX, offsetY) => {
    io.of('/table').to(room).emit('canvas:mousedown', {
      offsetX,
      offsetY,
    });
  };
  const mouseMove = (offsetX, offsetY) => {
    io.of('/table').to(room).emit('canvas:mousemove', {
      offsetX,
      offsetY,
    });
  };
  const mouseOver = (offsetX, offsetY) => {
    io.of('/table').to(room).emit('canvas:mouseover', {
      offsetX,
      offsetY,
    });
  };

  socket.on('canvas:mousedown', mouseDown);
  socket.on('canvas:mousemove', mouseMove);
  socket.on('canvas:mouseover', mouseOver);
};