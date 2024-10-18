import {redirect} from "next/navigation";

const roleBasedRoutes: { [key: string]: string[] } = {
    CA: [
        "/customers",
        "/customers/[dynamicSegment]",
        "/customers/create",
        "/sites",
        "/sites/[dynamicSegment]",
        "/sites/create",
        "/tags",
        "/tags/[dynamicSegment]",
        "/tags/create",
        "/teams",
        "/teams/[dynamicSegment]",
        "/teams/create",
        "/user-groups",
        "/user-groups/[dynamicSegment]",
        "/user-groups/create",
        "/users",
        "/users/[dynamicSegment]",
        "/users/create",
        "/my-company",
        "/my-profile",
    ],
    PA: [
        "/customers",
        "/customers/[dynamicSegment]",
        "/customers/create",
        "/sites",
        "/sites/[dynamicSegment]",
        "/sites/create",
        "/tags",
        "/tags/[dynamicSegment]",
        "/tags/create",
        "/forms",
        "/forms/[dynamicSegment]",
        "/forms/create",
        "/teams",
        "/teams/[dynamicSegment]",
        "/teams/create",
        "/user-groups",
        "/user-groups/[dynamicSegment]",
        "/user-groups/create",
        "/users",
        "/users/[dynamicSegment]",
        "/test-happiness-score",
        "/test-happiness-score-by-api",
    ],
    // Add more roles and routes as needed
};

export function checkUserRole(userIdentity: { role: string }, targetPathname: string): boolean | void {
    if (!userIdentity || !userIdentity.role) {
        redirect("/error");
        return;
    }

    const allowedRoutes = roleBasedRoutes[userIdentity.role];

    if (!allowedRoutes) {
        redirect("/unauthorized");
        return;
    }

    const isAllowed = allowedRoutes.some((route) => {
        if (!route.includes("[dynamicSegment]")) {
            return route === targetPathname;
        }

        const routeRegex = new RegExp(`^${route.replace("[dynamicSegment]", "[^/]+")}$`);
        return routeRegex.test(targetPathname);
    });

    if (!isAllowed) {
        redirect("/unauthorized");
        return;
    }

    return true;
}
