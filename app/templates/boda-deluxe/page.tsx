import { redirect } from "next/navigation";

export const metadata = {
  title: "Boda Deluxe | Kompralo"
};

export default function BodaDeluxeTemplatePage() {
  redirect("/templates/boda-deluxe/index.html");
}
