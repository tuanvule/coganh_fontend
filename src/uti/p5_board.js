import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import p5 from 'p5';

const P5Wrapper = forwardRef(({ width, height }, ref) => {
  const p5Ref = useRef();
  const p5Instance = useRef(null);
  const myFontRef = useRef(null) 
  const isload = useRef(null)

  useEffect(() => {
    const sketch = (p) => {

      p.setup = () => {
        p.createCanvas(width, height);
        console.log("hello")
        isload.current = true
        // p.textAlign(p5.CENTER, p5.CENTER);
        // p.background(220);
      };

      p.draw = () => {
        // p.background(220);
        // p.background(220); // Xóa canvas trước khi vẽ lại
      };
    };

    p5Instance.current = new p5(sketch, p5Ref.current);

    // Cleanup khi component unmount
    return () => {
      p5Instance.current.remove();
    };
  }, []);

  // Cung cấp các phương thức để vẽ từ bên ngoài
  useImperativeHandle(ref, () => ({
    drawText(x, y, text, size, color, strokeWidth, strokeFill) {
      console.log("draw")
      if (p5Instance.current && isload.current) {
        // p5Instance.current.textFont(myFontRef.current)
        if(typeof color === "string") {
          p5Instance.current.fill(color);
        } else {
          p5Instance.current.fill(...color);
        }
        p5Instance.current.textSize(size || 16);
        p5Instance.current.strokeWeight(strokeWidth);
        if(typeof strokeFill === "string") {
          p5Instance.current.stroke(strokeFill);
        } else {
          p5Instance.current.stroke(...strokeFill);
        }
        p5Instance.current.text(text, x, y);
      }
    },
    clearCanvas() {
      if (p5Instance.current) {
        console.log("clear")
        p5Instance.current.clear(); // Xóa toàn bộ canvas
      }
    },
    resizeCanvas(width, height) {
      if (p5Instance.current) {
        console.log("resize")
        p5Instance.current.resizeCanvas(width, height); // Thay đổi kích thước canvas
      }
    }
  }));

  return <div className="w-full h-full" ref={p5Ref}></div>;
});

export default P5Wrapper;
