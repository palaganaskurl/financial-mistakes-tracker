import { Anchor, Nav } from "grommet";
import { AddCircle, BarChart, Home } from "grommet-icons";

export default function BottomNav() {
  return (
    <Nav direction="row" justify="center" background="brand" pad="medium">
      <Anchor href="/home" icon={<Home />} />
      <Anchor href="/financial-drama" icon={<AddCircle />} />
      <Anchor icon={<BarChart />} />
    </Nav>
  );
}
