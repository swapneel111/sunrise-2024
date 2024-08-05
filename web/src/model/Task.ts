

export default class Task {
    id: number;
    title: string;
    description: string;
    persona: string;
    group: number;
    completed: boolean;
    section: number;
  
    constructor(id: number, title: string, description: string, persona: string, group: number, completed: boolean = false,section: number) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.persona = persona;
      this.group = group;
      this.completed = completed;
      this.section=section;
    }
  }
  