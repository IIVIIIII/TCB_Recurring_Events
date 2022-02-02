drop function if exists get_events;
create function get_events (starting date, ending date)
RETURNS TABLE(id_ bigint, event_name_ text, venue_ text, neighborhood_ text, start_date_ date, start_time_ time, end_date_ date, end_time_ time, all_day_event_ boolean, category_ text, event_cost_ text, purchase_req_ text, free_ boolean, show_map_link_ boolean, show_map_ boolean, event_description_ text, stage_time_ text, event_website_ text, recurring_type_ smallint, separation_count_ smallint, max_num_of_occurrences_ bigint, days_of_week_ bigint, exceptions_ date[]) AS
$$
BEGIN
  return query SELECT events.id, event_name, venue, neighborhood, start_date, start_time, end_date, end_time, all_day_event, category, event_cost, purchase_req, free, show_map_link, show_map, event_description, stage_time, event_website, recurring_type, separation_count, max_num_of_occurrences, days_of_week, exceptions.except_array FROM events,
LATERAL (
  SELECT ARRAY (
    SELECT exceptions.exception_date
    FROM exceptions
    WHERE exceptions.parent_event_id = events.id
  ) AS except_array
) exceptions
WHERE start_date <= ending AND end_date >= starting;
END;
$$
language plpgsql volatile;