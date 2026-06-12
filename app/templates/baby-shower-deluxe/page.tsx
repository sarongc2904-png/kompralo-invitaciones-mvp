import { redirect } from "next/navigation";

export const metadata = {
  title: "Baby Shower Deluxe"
};

export default function BabyShowerDeluxeTemplatePage() {
  redirect("/templates/baby-shower-deluxe/index.html");
}
