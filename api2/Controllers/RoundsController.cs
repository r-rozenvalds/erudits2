﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api2.Models;

namespace api2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoundsController : ControllerBase
    {
        private readonly GameDbContext _context;

        public RoundsController(GameDbContext context)
        {
            _context = context;
        }

        // GET: api/Rounds
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Round>>> GetRounds()
        {
            return await _context.Rounds.ToListAsync();
        }

        // GET: api/Rounds/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Round>> GetRound(Guid id)
        {
            var round = await _context.Rounds.FindAsync(id);

            if (round == null)
            {
                return NotFound();
            }

            return round;
        }

        // PUT: api/Rounds/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRound(Guid id, Round round)
        {
            if (id != round.Id)
            {
                return BadRequest();
            }

            _context.Entry(round).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoundExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Rounds
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Round>> PostRound(Round round)
        {
            _context.Rounds.Add(round);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRound", new { id = round.Id }, round);
        }

        // DELETE: api/Rounds/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRound(Guid id)
        {
            var round = await _context.Rounds.FindAsync(id);
            if (round == null)
            {
                return NotFound();
            }

            _context.Rounds.Remove(round);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RoundExists(Guid id)
        {
            return _context.Rounds.Any(e => e.Id == id);
        }
    }
}