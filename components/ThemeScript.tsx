export function ThemeScript() {
  const code = `
    (function() {
      try {
        const match = document.cookie.match(/theme=(dark|light)/);
        const theme = match ? match[1] : 'light';
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch(e) {}
    })();
  `
  return <script dangerouslySetInnerHTML={{ __html: code }} />
}
