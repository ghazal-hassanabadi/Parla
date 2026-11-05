export function initTabs(root = document) {
  const tabs = root.querySelectorAll('[role="tab"]');
  const panels = root.querySelectorAll('[role="tabpanel"]');
  if (!tabs.length) return;

  const select = (selectedTab) => {
    tabs.forEach((tab) => {
      const isSelected = tab === selectedTab;
      tab.setAttribute('aria-selected', isSelected);
      tab.tabIndex = isSelected ? 0 : -1;
    });
    panels.forEach((panel) => {
      panel.hidden = panel.id !== selectedTab.getAttribute('aria-controls');
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => select(tab));
  });
}