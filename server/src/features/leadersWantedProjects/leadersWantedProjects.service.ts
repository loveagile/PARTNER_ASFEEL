import {
  LeadersWantedProject,
  LeadersWantedProjectForES,
} from './leadersWantedProjects.model'

export const leadersWantedProjectsService = {
  async processLeadersWantedProjectData(data: LeadersWantedProject) {
    return {
      ...data,
      organizationName: data.organizationName || '',
      eventName: data.eventName || '',
      workplaceName: `${data.workplace.prefecture} ${data.workplace.city} ${data.workplace.address1}`,
      adoptCount: 0,
      selectCount: 0,
      recruitCount: 0,
      message: false,
      candidate: false,
    } as LeadersWantedProjectForES
  },
}
