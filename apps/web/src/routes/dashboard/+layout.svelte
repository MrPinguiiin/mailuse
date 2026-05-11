<script lang="ts">
  import { page } from "$app/state";
  import * as Sidebar from "$lib/components/ui/sidebar";
  import { BarChart3, History, KeyRound, LogOut, RefreshCw } from "lucide-svelte";

  let { children } = $props();

  const links = [
    { href: "/dashboard", label: "Overview", icon: BarChart3 },
    { href: "/dashboard/updates", label: "Updates", icon: RefreshCw },
    { href: "/dashboard/history", label: "History", icon: History },
    { href: "/dashboard/api", label: "API", icon: KeyRound },
  ];

  function logout() {
    localStorage.removeItem("mailuse:owner-token");
    window.location.href = "/dashboard";
  }
</script>

<Sidebar.Provider>
  <Sidebar.Sidebar collapsible="icon">
    <Sidebar.Header>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton size="lg" href="/dashboard">
            <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <BarChart3 class="size-4" />
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">mailuse</span>
              <span class="truncate text-xs">Owner</span>
            </div>
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Header>
    <Sidebar.Content>
      <Sidebar.Group>
        <Sidebar.GroupLabel>Operations</Sidebar.GroupLabel>
        <Sidebar.Menu>
          {#each links as link}
            {@const Icon = link.icon}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton href={link.href} isActive={page.url.pathname === link.href} tooltip={link.label}>
                <Icon class="size-4" />
                <span>{link.label}</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.Group>
    </Sidebar.Content>
    <Sidebar.Footer>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton onclick={logout} tooltip="Logout">
            <LogOut class="size-4" />
            <span>Logout</span>
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Footer>
    <Sidebar.Rail />
  </Sidebar.Sidebar>
  <Sidebar.Inset>
    <div class="flex h-14 items-center gap-2 border-b px-4 lg:hidden">
      <Sidebar.Trigger />
      <span class="text-sm font-medium">Owner dashboard</span>
    </div>
    {@render children()}
  </Sidebar.Inset>
</Sidebar.Provider>
