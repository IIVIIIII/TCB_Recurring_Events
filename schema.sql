CREATE TABLE events (
    id int8  NOT NULL,
    event_name text  NOT NULL,
    venue text  NOT NULL,
    neighborhood text  NULL,
    start_date date  NOT NULL,
    start_time time  NULL,
    end_date date  NOT NULL  DEFAULT '9999-12-31',
    end_time time  NULL,
    all_day_event boolean  NULL  DEFAULT false,
    category text  NULL,
    event_cost text  NULL,
    purchase_req text  NULL,
    free boolean  NULL,
    show_map_link boolean  NULL  DEFAULT false,
    show_map boolean  NULL,
    event_description text  NULL  DEFAULT false,
    stage_time text  NULL,
    event_website text  NULL ,
    recurring_type int2  NOT NULL  DEFAULT 0,
    separation_count int2  NULL  DEFAULT 0,
    max_num_of_occurrences int8  NULL,
    days_of_week int8  NULL,
    created_at timestamptz  NULL  DEFAULT NOW(),
    PRIMARY KEY (id)
);

CREATE TABLE exceptions (
    id int8  NOT NULL,
    parent_event_id int8  NOT NULL,
    exception_date date  NOT NULL,
    created_at timestamptz  NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (parent_event_id) REFERENCES events(id)
);

