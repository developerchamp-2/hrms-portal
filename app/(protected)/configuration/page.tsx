import ConfigurationForm from "./configuration-form";
import { getConfiguration } from "@/lib/actions/configuration";
import { getRoutePermissions } from "@/lib/rbac";
import { redirect } from "next/navigation";


const ConfigurationPage = async () => {
    const route = "/configuration";
    const permissions = await getRoutePermissions(route);

    if (!permissions.canView) {
        redirect("/404");
    }

    const configuration = await getConfiguration();

    return (
        <ConfigurationForm
            data={configuration || undefined}
            canEdit={permissions.canEdit}
        />
    );
};

export default ConfigurationPage;
