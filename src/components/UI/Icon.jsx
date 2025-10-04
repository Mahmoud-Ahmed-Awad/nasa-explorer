import React from "react";
import {
  Rocket,
  Satellite,
  Building2,
  Radio,
  Sun,
  Telescope,
  User,
  AlertTriangle,
  Info,
  Thermometer,
  Scale,
  Settings,
  Copy,
  Share2,
  ExternalLink,
  X,
  Snowflake,
  Trophy,
  Search,
  MessageCircle,
  GraduationCap,
  Compass,
  BarChart3,
  Star,
  Home,
  Globe,
  TrendingUp,
  Gamepad2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
} from "lucide-react";
import { FaMeteor, FaRobot } from "react-icons/fa";

const Icon = ({ name, size = 24, className = "", ...props }) => {
  const iconSize = typeof size === "number" ? size : 24;

  const icons = {
    // Space vehicles and objects
    rocket: Rocket,
    satellite: Satellite,
    spaceStation: Building2,
    telescope: Telescope,
    sun: Sun,
    antenna: Radio,
    comet: FaMeteor,
    astronaut: User,

    // UI icons
    copy: Copy,
    share: Share2,
    external: ExternalLink,
    close: X,

    // Status icons
    warning: AlertTriangle,
    info: Info,

    // Temperature and measurement icons
    temperature: Thermometer,
    scale: Scale,

    // Settings and gear
    gear: Settings,

    // Snowflake for exoplanet details
    snowflake: Snowflake,

    // Achievement icons
    trophy: Trophy,
    search: Search,
    messageCircle: MessageCircle,
    graduationCap: GraduationCap,
    compass: Compass,
    barChart: BarChart3,
    star: Star,

    // Navigation icons
    home: Home,
    globe: Globe,

    // Additional icons
    trendingUp: TrendingUp,
    gamepad: Gamepad2,
    mail: Mail,
    robot: FaRobot,

    // Contact icons
    phone: Phone,
    mapPin: MapPin,
    clock: Clock,
    send: Send,
    checkCircle: CheckCircle,
  };

  const IconComponent = icons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <span className={`inline-flex items-center justify-center ${className}`}>
      <IconComponent size={iconSize} {...props} />
    </span>
  );
};

export default Icon;
