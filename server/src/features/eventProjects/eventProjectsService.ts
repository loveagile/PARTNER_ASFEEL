import { EventProject, EventProjectForES } from './eventProjects.model'

export const eventProjectsService = {
  async processEventProjectData(data: EventProject) {
    return {
      ...data,
      startedAt: data.createdAt,
      finishedAt: data.createdAt,
      adoptCount: 0,
      selectCount: 0,
      recruitCount: 0,
      message: false,
      candidate: false,
    } as EventProjectForES
  },
}
