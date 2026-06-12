import { redirect } from "next/navigation";

export const metadata = {
  title: "Baby Shower Deluxe"
};

export default function BabyShowerDeluxeTemplatePage() {
  redirect("/demo/baby-shower");
}
