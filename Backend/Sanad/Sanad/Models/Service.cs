﻿namespace Sanad.Models
{
    public class Service
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<string>? Details { get; set; }
        public string? ImageUrl { get; set; }
    }
}
