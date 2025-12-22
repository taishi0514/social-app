"use client";

import Link from "next/link";

import { Burger, Menu } from "@mantine/core";

type AuthenticatedMenuProps = {
  logoutReturnTo: string;
};

export function AuthenticatedMenu({ logoutReturnTo }: AuthenticatedMenuProps) {
  return (
    <Menu width={210} position="bottom-end" offset={4} shadow="md">
      <Menu.Target>
        <Burger size="sm" color="dark" aria-label="アカウントメニュー" />
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item component={Link} href="/dashboard">
          ダッシュボード
        </Menu.Item>
        <Menu.Item component={Link} href="/onboarding">
          プロフィール
        </Menu.Item>
        <Menu.Item
          component="a"
          href={`/auth/logout?returnTo=${logoutReturnTo}`}
        >
          ログアウト
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item component={Link} href="settings/withdrawal" color="red">
          退会の手続き
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
