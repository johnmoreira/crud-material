import { Lessons } from "./lessons";

export interface Course {
    id: string;
    name: string;
    category: string;
    lessons?: Lessons[];
}
