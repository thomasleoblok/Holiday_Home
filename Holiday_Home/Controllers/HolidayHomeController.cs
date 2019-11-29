﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Holiday_Home.Models;

namespace Holiday_Home.Controllers
{
    [Route("api/holidayhome")]
    [ApiController]
    public class HolidayHomeController : ControllerBase
    {
        private readonly HolidayContext _context;

        public HolidayHomeController(HolidayContext context)
        {
            _context = context;

            //Since it uses InMemoryDatabase, there is no data from the start
            if (_context.HolidayHomes.Count() == 0)
            {
                _context.HolidayHomes.Add(new HolidayHome { Address = "Finca el Pato, 29004 Málaga, Spanien", RentalPrice = 550 });
                _context.SaveChanges();
            }
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<HolidayHome>>> GetHolidayHomes()
        {
            return await _context.HolidayHomes.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<HolidayHome>> GetHolidayHome(int id)
        {
            var holidayHome = await _context.HolidayHomes.FindAsync(id);

            if (holidayHome == null)
            {
                return NotFound();
            }

            return holidayHome;
        }
    }
}