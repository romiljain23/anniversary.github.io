export function showLoadingScreen({ profileScreen, loadingScreen }) {
  profileScreen.classList.add("is-hidden");
  loadingScreen.classList.remove("is-hidden");
}

export function lockEditableOnSelect(editableNode) {
  editableNode.blur();
  editableNode.setAttribute("contenteditable", "false");
}

export function sanitizeEditableText(node) {
  const cleaned = node.textContent.replace(/\s+/g, " ").trim();
  node.textContent = cleaned || "Vinod&Sunita";
}
