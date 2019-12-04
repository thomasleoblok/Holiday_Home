using Microsoft.AspNetCore.Mvc;
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

            //Since it uses InMemoryDatabase, there is no data from the start, therefore 1 instance is created
            if (_context.HolidayHomes.Count() == 0)
            {
                _context.HolidayHomes.AddRange(new HolidayHome { Address = "Finca el Pato, 29004 Málaga, Spanien", RentalPrice = 550 }, new HolidayHome { Address = "Sdr Almstokvej, 6623 Vorbasse", RentalPrice = 400 });
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

        [HttpPost]
        public async Task<ActionResult<HolidayHome>> PostHolidayHome(HolidayHome hHome)
        {
            //Checks if the Home owner doesn't exits
            if (!await _context.HolidayOwners.AnyAsync(h => h.Id == hHome.HomeOwnerId))
            {
                return Content("Holiday Home Owner does not exist");
            }

            _context.HolidayHomes.Add(hHome);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetHolidayHome), new { id = hHome.Id }, hHome);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutHolidayHome(int id, HolidayHome hHome)
        {
            if (id != hHome.Id)
            {
                return BadRequest();
            }

            _context.Entry(hHome).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHolidayHome(int id)
        {
            var holidayHome = await _context.HolidayHomes.FindAsync(id);

            if (holidayHome == null)
            {
                return NotFound();
            }

            _context.HolidayHomes.Remove(holidayHome);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}