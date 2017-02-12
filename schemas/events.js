module.exports = {
  // Follows fullcalendar's event object model, display options omitted:
  // http://fullcalendar.io/docs/event_data/Event_Object/
  id: {type: String, default: ''}, // this is the slug
  meetupid: {type: String, default: ''},
  title: {type: String, default: ''}, // Display title
  start: {type: String, default: ''}, // Moment-ish date, ISO8601 string, http://en.wikipedia.org/wiki/ISO_8601
  end: {type: String, default: ''}, // same ^^
  allDay: {type: Boolean, default: false}, // shows time of day or not
  url: {type: String, default: ''}, // an external link you can use to override where to go when clicking
  // These options are used within brigadehub for content storage
  description: {type: String, default: ''},
  location: {type: String, default: ''},
  host: {type: String, default: ''}
}
