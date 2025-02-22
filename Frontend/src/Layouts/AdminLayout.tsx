import React from "react";
import {
  ActionIcon,
  Anchor,
  AppShell,
  Avatar,
  Burger,
  Group,
  Indicator,
  Menu,
  Text,
} from "@mantine/core";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBellRinging,
  IconCalendar,
  IconDashboard,
  IconNotes,
  IconSettings,
  IconUserCircle,
  IconLogout,
  IconBell,
  IconPhoto,
  IconUsers,
  IconReport,
} from "@tabler/icons-react";
import { CustomLogo } from "../components/Logo/CustomLogo";
import classes from "./NavbarSimple.module.css";
import { useAuth } from "../Contexts/AuthContext";
import axios from "axios";

// Define main navigation links for admin
const navLinks = [
  { link: "/admin", label: "Dashboard", icon: IconDashboard },
  { link: "/admin/users", label: "User Management", icon: IconUsers },
  { link: "/admin/appointments", label: "Appointments", icon: IconCalendar },
  { link: "/admin/availability", label: "Availability", icon: IconCalendar },
  {
    link: "/admin/notifications",
    label: "Notifications",
    icon: IconBellRinging,
  },
  { link: "/admin/reports", label: "Reports", icon: IconReport },
  { link: "/admin/settings", label: "Settings", icon: IconSettings },
];

const footerLinks = [
  { link: "/admin/profile", label: "Profile", icon: IconUserCircle },
];

const AdminLayout: React.FC = () => {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8005/api/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = navLinks.map((item) => (
    <Anchor
      key={item.label}
      component={Link}
      to={item.link}
      className={classes.link}
      data-active={isActive(item.link) || undefined}
      mb="xs"
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Anchor>
  ));

  const footerItems = footerLinks.map((item) => (
    <Anchor
      key={item.label}
      component={Link}
      to={item.link}
      className={classes.link}
      data-active={isActive(item.link) || undefined}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Anchor>
  ));

  return (
    <AppShell
      padding="md"
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      header={{ height: 60 }}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <CustomLogo size={40} />
          <Group>
            <Menu shadow="md" width={200} offset={15} withArrow>
              <Menu.Target>
                <Indicator inline processing color="red" size={10} withBorder>
                  <ActionIcon variant="white" size="lg" color="gray">
                    <IconBell size={30} stroke={1.5} />
                  </ActionIcon>
                </Indicator>
              </Menu.Target>

              <Menu.Dropdown w={300}>
                <Menu.Label>Notifications</Menu.Label>
                <Menu.Item
                  leftSection={<IconNotes size={14} />}
                  rightSection={
                    <Text size="xs" color="dimmed">
                      2 min ago
                    </Text>
                  }
                >
                  New Message from John
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            <Avatar color="cyan" radius="xl" name={user?.fullName || "User"} />
          </Group>
        </Group>
      </AppShell.Header>

      {/* Sidebar Navigation */}
      <AppShell.Navbar p="md">
        <div className={classes.navbarMain}>{navItems}</div>

        {/* Footer Section */}
        <div className={classes.footer}>
          {footerItems}
          <Anchor onClick={handleLogout} className={classes.link}>
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>Logout</span>
          </Anchor>
        </div>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default AdminLayout;
