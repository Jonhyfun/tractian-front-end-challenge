import { toast } from "react-hot-toast";

export function HandleCopy(content: string, prepend: string) {
  navigator.clipboard.writeText(content).then(() => {
    toast.success(`${prepend} coppied to clipboard successfully!`);
  }).catch(() => {
    toast.error("Error when copying to clipboard.")
  });
}