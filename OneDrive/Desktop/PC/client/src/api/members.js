import { apiGet } from "./client";

export function getMembers() {
    return apiGet("/Members");
}

export function getMember(id) {
    return apiGet(`/Members(${id})`);
}