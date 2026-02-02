document.addEventListener('DOMContentLoaded', () => {
  const codeBlocks = document.querySelectorAll('.highlight');

  codeBlocks.forEach((block) => {
    // Create the copy button
    const button = document.createElement('button');
    button.className = 'copy-code-button';
    button.type = 'button';
    button.ariaLabel = 'Copy code to clipboard';

    // Add icon (using the existing class logic, but we need to ensure the icon shows up)
    // The existing CSS uses .copy-clipboard-icon::before with background-image
    const icon = document.createElement('span');
    icon.className = 'copy-clipboard-icon';
    // We might need to adjust styles for this icon since the original was a link

    button.appendChild(icon);

    // Position the button
    // We need to make sure the parent has relative positioning
    if (getComputedStyle(block).position === 'static') {
      block.style.position = 'relative';
    }

    block.appendChild(button);

    button.addEventListener('click', () => {
      const code = block.querySelector('code, pre')?.innerText;
      if (!code) return;

      navigator.clipboard.writeText(code).then(() => {
        // success feedback
        button.classList.add('copied');
        const originalLabel = button.ariaLabel;
        button.ariaLabel = 'Copied!';

        setTimeout(() => {
          button.classList.remove('copied');
          button.ariaLabel = originalLabel;
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    });
  });
});
