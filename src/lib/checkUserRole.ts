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
        "/option-lists",
        "/option-lists/groups/[dynamicSegment]",
        "/option-lists/groups/create",
        "/option-lists/items/[dynamicSegment]",
        "/option-lists/items/create",
        "/option-lists/lists/[dynamicSegment]",
        "/option-lists/lists/create",
        "/select-items",
        "/select-items/[dynamicSegment]",
        "/select-items/create",
        "/forms",
        "/forms/[dynamicSegment]",
        "/forms/create",
        "/tools",
        "/tools/[dynamicSegment]",
        "/tools/create",
        "/workflows",
        "/workflows/[dynamicSegment]",
        "/workflows/create",
        "/business-processes",
        "/business-processes/[dynamicSegment]",
        "/business-processes/create",
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

const redirectRoutes: { [key: string]: string } = {
    PA: "/customers",
    CA: "/customers",
    // Add more role-based default redirect routes if needed
};


export function checkUserRole(userIdentity: { role: string }, targetPathname: string): boolean | void {
    if (!userIdentity || !userIdentity.role) {
        redirect("/error");
        return;
    }

    const allowedRoutes = roleBasedRoutes[userIdentity.role];

    if (!allowedRoutes) {
        redirect('/');
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
        const fallBackRoute = redirectRoutes[userIdentity.role] || '/';
        return redirect(fallBackRoute)
        return;
    }

    return true;
}
