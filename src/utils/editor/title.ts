import { mergeAttributes, Node } from "@tiptap/core";

export type Level = 1 | 2 | 3 | 4 | 5 | 6;

export interface ITitleOptions {
    level: Level;
    HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    // interface Commands<ReturnType> {
    // Custom commands go here. Leaving this snippet for any devs needing to make their own extension
    // }
}

export const Title = Node.create<ITitleOptions>({
    name: "title",

    addOptions() {
        return {
            level: 1,
            HTMLAttributes: {},
        };
    },

    content: "text*",

    marks: "",

    group: "block",

    defining: true,

    renderHTML({ HTMLAttributes }) {
        const level = this.options.level;

        return [`h${level}`, mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },
});

export default Title;