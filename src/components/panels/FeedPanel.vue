<script>
import steem from 'steem'
import Discussions from './Discussions'

export default {
  name: 'Feed',
  mixins: [ Discussions ],
  // data () {
  //   return {}
  // }
  methods: {
    getDiscussions () {
      console.log('username', this.$route.params.username)
      let query = {
        tag: this.$route.params.username,
        limit: 11,
        start_permlink: this.next.permlink,
        start_author: this.next.author
      }
      // 스팀잇 최근글 가져오기
      return steem.api.getDiscussionsByFeedAsync(query)
    }
  }
}
</script>