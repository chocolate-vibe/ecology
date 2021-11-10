import { Getters } from 'vuex-smart-module';
import { MainState } from './state';

export class MainGetters extends Getters<MainState> {
  get getFiltersApi(): { [key: string]: number | string } {
    const filters: { teacherId?: number, educationGroupId?: number, teamLeaderId?: number, order?: string } = {};
    if (this.state.filterTeamLeader) filters.teamLeaderId = this.state.filterTeamLeader.id;
    if (this.state.filterTeacher) filters.teacherId = this.state.filterTeacher.id;
    if (this.state.filterGroup) filters.educationGroupId = this.state.filterGroup.id;
    if (this.state.filterOrder) filters.order = this.state.filterOrder;
    return filters;
  }

  get getStateScroll(): boolean {
    return this.state.offset !== 0 && this.state.offset % 30 !== 0 && this.state.lessons.length % 30 !== 0;
  }

  get teachers() {
    if (this.state.filterTeamLeader) return this.state.teachersByTeamLeader;
    return this.state.teachersWithLessons;
  }

  get educationGroups() {
    if (this.state.filterTeacher) return this.state.educationGroupsByTeacher;
    if (this.state.filterTeamLeader !== null) return this.state.educationGroupsByTeamLeader;
    return this.state.educationGroupsWithLessons;
  }
}
