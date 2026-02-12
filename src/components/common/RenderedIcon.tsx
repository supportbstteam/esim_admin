import * as FiIcons from "react-icons/fi";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as IoIcons from "react-icons/io5";
import * as AiIcons from "react-icons/ai";
import * as BsIcons from "react-icons/bs";
import * as RiIcons from "react-icons/ri";
import * as SiIcons from "react-icons/si";
import * as HiIcons from "react-icons/hi";
import * as GiIcons from "react-icons/gi";
import * as TbIcons from "react-icons/tb";
import * as PiIcons from "react-icons/pi";
import * as VscIcons from "react-icons/vsc";
import * as WiIcons from "react-icons/wi";
import * as CgIcons from "react-icons/cg";
import * as GoIcons from "react-icons/go";
import * as RxIcons from "react-icons/rx";
import * as LuIcons from "react-icons/lu";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ICON_LIBS: Record<string, any> = {
  Fi: FiIcons,
  Fa: FaIcons,
  Md: MdIcons,
  Io: IoIcons,
  Ai: AiIcons, // Ant Design
  Bs: BsIcons,
  Ri: RiIcons,
  Si: SiIcons,
  Hi: HiIcons,
  Gi: GiIcons,
  Tb: TbIcons,
  Pi: PiIcons,
  Vsc: VscIcons,
  Wi: WiIcons,
  Cg: CgIcons,
  Go: GoIcons,
  Rx: RxIcons,
  Lu: LuIcons,
};

export function IconRenderer({
  name,
  size = 24,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  if (!name || typeof name !== "string") return null;

  // Example: MdTravelExplore → Md
  const prefix = name.slice(0, 2);
  const icons = ICON_LIBS[prefix];

  if (!icons) return null;

  const IconComponent = icons[name as keyof typeof icons];

  if (!IconComponent) return null;

  return <IconComponent size={size} className={className} />;
}
