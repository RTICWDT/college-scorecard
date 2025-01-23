export function useScroll() {
  const fixedHeaderHeightOffset = 150;

  const scrollToAnchor = (anchorId, offset = fixedHeaderHeightOffset, behavior = "smooth") => {
    let id = anchorId.replace('#', '');
    const anchor = document.querySelector(`#${id}`);
    if (anchor) {
      const elementPosition = anchor.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior,
      });
    }
  }

  const scrollToElement = (element, offset = fixedHeaderHeightOffset) => {
    if (element && element instanceof Element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  }

  return {
    scrollToAnchor,
    scrollToElement,
  }
}