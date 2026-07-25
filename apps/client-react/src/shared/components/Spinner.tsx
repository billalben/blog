import { Spin } from "antd";
import type { SpinProps } from "antd";

export const Spinner = (props: SpinProps) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: 200,
    }}
  >
    <Spin {...props} />
  </div>
);
