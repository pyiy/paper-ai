//这里是settings页面
import SettingsWrapper from "@/components/SettingsWrapper";
//i18n
import { IndexProps } from "@/utils/global";

export default async function settings({ params }: IndexProps) {
  const { lng } = await params;
  return (
    <div className="h-screen w-full ">
      <SettingsWrapper lng={lng} />
    </div>
  );
}
