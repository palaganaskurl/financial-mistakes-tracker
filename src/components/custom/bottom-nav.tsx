"use client";

import Link from "next/link";
import { Box, HStack, IconButton } from "@chakra-ui/react";
import {
  AiOutlineHome,
  AiOutlinePlus,
  AiOutlineLineChart,
} from "react-icons/ai";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href);

  const navItems = [
    { href: "/home", icon: AiOutlineHome, label: "Home" },
    { href: "/financial-drama", icon: AiOutlinePlus, label: "Add" },
    { href: "/analytics", icon: AiOutlineLineChart, label: "Analytics" },
  ];

  return (
    <Box
      as="nav"
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="bg"
      borderTopWidth="1px"
      borderTopColor="border"
      zIndex={40}
    >
      <HStack justify="space-around" px={4} py={2} gap={0}>
        {navItems.map(({ href, icon: IconComponent, label }) => (
          <Link key={href} href={href}>
            <IconButton
              aria-label={label}
              variant="ghost"
              size="lg"
              color={isActive(href) ? "blue.500" : "fg.muted"}
            >
              <IconComponent size={24} />
            </IconButton>
          </Link>
        ))}
      </HStack>
    </Box>
  );
}
